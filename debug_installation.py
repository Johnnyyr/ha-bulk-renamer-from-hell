#!/usr/bin/env python3
"""
Debug script for HA Bulk Renamer from Hell installation
Run this script to check if the component is properly installed
"""

import os
import sys
import json

def check_installation():
    print("🔍 HA Bulk Renamer from Hell - Installation Debug")
    print("=" * 50)
    
    # Check if we're in the right directory
    current_dir = os.getcwd()
    print(f"📁 Current directory: {current_dir}")
    
    # Check project structure
    print("\n📋 Checking project structure...")
    required_files = [
        "custom_components/ha_bulk_renamer_from_hell/__init__.py",
        "custom_components/ha_bulk_renamer_from_hell/manifest.json",
        "custom_components/ha_bulk_renamer_from_hell/websocket_api.py",
        "custom_components/ha_bulk_renamer_from_hell/www/ha-bulk-renamer-from-hell.js",
        "hacs.json",
        "README.md"
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} - MISSING!")
    
    # Check manifest.json content
    print("\n📄 Checking manifest.json...")
    manifest_path = "custom_components/ha_bulk_renamer_from_hell/manifest.json"
    if os.path.exists(manifest_path):
        with open(manifest_path, 'r') as f:
            manifest = json.load(f)
        
        required_keys = ["domain", "name", "version", "documentation", "issue_tracker", "integration_type", "codeowners"]
        for key in required_keys:
            if key in manifest:
                print(f"✅ {key}: {manifest[key]}")
            else:
                print(f"❌ {key} - MISSING!")
    
    # Check hacs.json
    print("\n📄 Checking hacs.json...")
    if os.path.exists("hacs.json"):
        with open("hacs.json", 'r') as f:
            hacs_config = json.load(f)
        print(f"✅ HACS config: {hacs_config}")
    
    # Installation instructions
    print("\n🚀 Installation Instructions:")
    print("1. Copy the entire 'custom_components/ha_bulk_renamer_from_hell' folder to your HA config/custom_components/")
    print("2. Restart Home Assistant")
    print("3. Check HA logs for any errors:")
    print("   - Settings → System → Logs")
    print("   - Look for 'ha_bulk_renamer_from_hell' entries")
    print("4. The panel should appear in the sidebar as 'HA Bulk Renamer from Hell'")
    
    print("\n🔧 Troubleshooting:")
    print("- Make sure you're an admin user (panel requires admin rights)")
    print("- Check HA logs for Python errors")
    print("- Verify file permissions are correct")
    print("- Try clearing browser cache")
    
    print("\n📝 Enable debug logging in configuration.yaml:")
    print("logger:")
    print("  logs:")
    print("    custom_components.ha_bulk_renamer_from_hell: debug")

if __name__ == "__main__":
    check_installation()
