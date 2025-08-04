
from .websocket_api import setup_websocket

async def async_setup(hass, config):
    setup_websocket(hass)
    hass.http.register_static_path(
        "/ha_bulk_renamer_from_hell", hass.config.path("custom_components/ha_bulk_renamer_from_hell/www"), False
    )
    hass.components.frontend.async_register_built_in_panel(
        component_name="custom",
        sidebar_title="HA Bulk Renamer from Hell",
        sidebar_icon="mdi:rename-box",
        frontend_url_path="ha_bulk_renamer_from_hell",
        config={"module_url": "/ha_bulk_renamer_from_hell/ha-bulk-renamer-from-hell.js"},
        require_admin=True,
    )

    async def handle_remove_panel(call):
        hass.components.frontend.async_remove_panel("ha_bulk_renamer_from_hell")
    hass.services.async_register(
        "ha_bulk_renamer_from_hell", "remove_panel", handle_remove_panel
    )
    return True
