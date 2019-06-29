const localStoragePrefix = "import-map-override:";

window.importMapOverrides = {
  addOverride(moduleName, url) {
    const key = localStoragePrefix + moduleName;
    localStorage.setItem(key, url);
    fireChangedEvent();
    return window.importMapOverrides.getOverrideMap();
  },
  getOverrideMap() {
    const overrides = { imports: {} };
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(localStoragePrefix)) {
        overrides.imports[
          key.slice(localStoragePrefix.length)
        ] = localStorage.getItem(key);
      }
    }

    return overrides;
  },
  removeOverride(moduleName) {
    const key = localStoragePrefix + moduleName;
    const hasItem = localStorage.getItem(key) !== null;
    localStorage.removeItem(key);
    fireChangedEvent();
    return hasItem;
  },
  resetOverrides() {
    Object.keys(window.importMapOverrides.getOverrideMap().imports).forEach(
      moduleName => {
        window.importMapOverrides.removeOverride(moduleName);
      }
    );
    fireChangedEvent();
    return window.importMapOverrides.getOverrideMap();
  },
  hasOverrides() {
    return (
      Object.keys(window.importMapOverrides.getOverrideMap().imports).length > 0
    );
  }
};

function fireChangedEvent() {
  // Set timeout so that event fires after the change has totally finished
  setTimeout(() => {
    if (window.CustomEvent) {
      window.dispatchEvent(new CustomEvent("import-map-overrides:change"));
    }
  });
}

const overrideMap = window.importMapOverrides.getOverrideMap();
const importMapMetaElement = document.querySelector(
  'meta[name="importmap-type"]'
);
export const importMapType = importMapMetaElement
  ? importMapMetaElement.getAttribute("content")
  : "import-map";

if (Object.keys(overrideMap.imports).length > 0) {
  const overrideMapElement = document.createElement("script");
  overrideMapElement.type = importMapType;
  overrideMapElement.id = "import-map-overrides"; // for debugging and for UI to identify this import map as special
  overrideMapElement.innerHTML = JSON.stringify(overrideMap);

  const importMaps = document.querySelectorAll(
    `script[type="${importMapType}"]`
  );
  if (importMaps.length > 0) {
    importMaps[importMaps.length - 1].insertAdjacentElement(
      "afterend",
      overrideMapElement
    );
  } else {
    document.head.appendChild(overrideMapElement);
  }
}
