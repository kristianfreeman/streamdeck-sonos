import { FormBuilder } from "@rweich/streamdeck-formbuilder";
import { Streamdeck } from "@rweich/streamdeck-ts";

import { isSettings, Settings } from "./Settings";

const pi = new Streamdeck().propertyinspector();
let builder: FormBuilder<Settings> | undefined;

pi.on("websocketOpen", ({ uuid }) => pi.getSettings(uuid)); // trigger the didReceiveSettings event

pi.on("didReceiveSettings", ({ settings }) => {
  if (builder === undefined) {
    const initialData: Settings = isSettings(settings)
      ? settings
      : { ip_address: "", volume: "0" };
    builder = new FormBuilder<Settings>(initialData);

    const ip_address = builder.createInput().setLabel(
      "Sonos Device IP Address",
    );
    builder.addElement('ip_address', ip_address);

    builder.appendTo(document.querySelector(".sdpi-wrapper") ?? document.body);

    builder.on("change-settings", () => {
      if (pi.pluginUUID === undefined) {
        console.error(
          "pi has no uuid! is it registered already?",
          pi.pluginUUID,
        );
        return;
      }
      pi.setSettings(pi.pluginUUID, builder?.getFormData());
    });
  } else if (isSettings(settings)) {
    builder.setFormData(settings);
  }
});

export default pi;
