
from .websocket_api import setup_websocket
import logging
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from typing import Any

_LOGGER = logging.getLogger(__name__)
DOMAIN = "ha_bulk_renamer_from_hell"

async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up the HA Bulk Renamer from Hell component."""
    # This component doesn't need configuration - just setup the panel
    await _setup_panel(hass)
    return True

async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up from a config entry - not used but required for some HA versions."""
    return True

async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    return True

async def _setup_panel(hass: HomeAssistant) -> None:
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
