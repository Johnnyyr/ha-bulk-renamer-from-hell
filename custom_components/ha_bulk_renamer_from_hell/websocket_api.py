
import logging
import homeassistant.helpers.entity_registry as er
from homeassistant.components import websocket_api

_LOGGER = logging.getLogger(__name__)

def setup_websocket(hass):
    @websocket_api.websocket_command({
        "type": "ha_bulk_renamer_from_hell/get_entities",
        "filter": str,
    })
    @websocket_api.async_response
    async def handle_get_entities(hass, connection, msg):
        try:
            filter_text = msg.get("filter", "").strip().lower()
            if not filter_text:
                _LOGGER.warning("Websocket: Empty filter received")
                connection.send_error(msg["id"], "invalid_filter", "Filter darf nicht leer sein.")
                return
            _LOGGER.debug("Searching entities with filter: %s", filter_text)
            registry = er.async_get(hass)
            result = []
            for entity in registry.entities.values():
                entity_id_lower = entity.entity_id.lower()
                name_lower = (entity.original_name or "").lower()
                if filter_text in entity_id_lower or filter_text in name_lower:
                    result.append({
                        "entity_id": entity.entity_id,
                        "name": entity.original_name or entity.entity_id,
                        "area_id": entity.area_id,
                        "device_id": entity.device_id
                    })
            _LOGGER.info("Found %d entities matching filter '%s'", len(result), filter_text)
            connection.send_result(msg["id"], {"entities": result})
        except Exception as err:
            _LOGGER.exception("Fehler beim Suchen von Entities: %s", err)
            connection.send_error(msg["id"], "get_entities_failed", f"Unerwarteter Fehler beim Suchen: {err}")

    @websocket_api.websocket_command({
        "type": "ha_bulk_renamer_from_hell/rename_entities",
        "rename_map": dict,
    })
    @websocket_api.async_response
    async def handle_rename_entities(hass, connection, msg):
        try:
            rename_map = msg.get("rename_map", {})
            if not rename_map:
                _LOGGER.warning("Websocket: Empty rename_map received")
                connection.send_error(msg["id"], "invalid_rename_map", "Rename map darf nicht leer sein.")
                return
            _LOGGER.info("Starting bulk rename operation for %d entities", len(rename_map))
            registry = er.async_get(hass)
            errors = {}
            successful_renames = []
            # Validate all entity IDs first
            for old_id, new_id in rename_map.items():
                if not old_id or not new_id:
                    errors[old_id] = "Entity ID darf nicht leer sein."
                    continue
                if old_id == new_id:
                    errors[old_id] = "Neue Entity ID ist identisch mit aktueller ID."
                    continue
                # Check if old entity exists
                if not registry.async_get(old_id):
                    errors[old_id] = "Entity nicht im Registry gefunden."
                    continue
                # Check if new entity ID already exists
                if registry.async_get(new_id):
                    errors[old_id] = f"Entity ID '{new_id}' existiert bereits."
                    continue
            # Perform renames for valid entities
            for old_id, new_id in rename_map.items():
                if old_id in errors:
                    continue
                try:
                    await registry.async_update_entity(old_id, new_entity_id=new_id)
                    successful_renames.append({"old_id": old_id, "new_id": new_id})
                    _LOGGER.info("Erfolgreich umbenannt: %s → %s", old_id, new_id)
                except Exception as err:
                    error_msg = str(err)
                    errors[old_id] = error_msg
                    _LOGGER.error("Fehler beim Umbenennen %s zu %s: %s", old_id, new_id, error_msg)
            _LOGGER.info("Bulk rename completed: %d erfolgreich, %d Fehler", len(successful_renames), len(errors))
            connection.send_result(msg["id"], {
                "errors": errors,
                "successful_renames": successful_renames,
                "total_requested": len(rename_map),
                "successful_count": len(successful_renames),
                "error_count": len(errors)
            })
        except Exception as err:
            _LOGGER.exception("Unerwarteter Fehler beim Bulk-Rename: %s", err)
            connection.send_error(msg["id"], "rename_entities_failed", f"Unerwarteter Fehler beim Umbenennen: {err}")
    
    # Register the websocket commands
    websocket_api.async_register_command(hass, handle_get_entities)
    websocket_api.async_register_command(hass, handle_rename_entities)
