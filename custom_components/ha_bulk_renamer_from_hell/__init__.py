
from .websocket_api import setup_websocket
import logging

_LOGGER = logging.getLogger(__name__)
DOMAIN = "ha_bulk_renamer_from_hell"

async def async_setup(hass, config):
    """Set up the HA Bulk Renamer from Hell component."""
    # Only setup if domain is in config or if we want auto-setup
    if DOMAIN not in config:
        # Auto-setup without config entry
        await _setup_panel(hass)
        return True
    
    await _setup_panel(hass)
    return True

async def _setup_panel(hass):
    """Setup the panel and services."""
    _LOGGER.info("Setting up HA Bulk Renamer from Hell panel")
    
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
        DOMAIN, "remove_panel", handle_remove_panel
    )
    
    _LOGGER.info("HA Bulk Renamer from Hell panel registered successfully")
