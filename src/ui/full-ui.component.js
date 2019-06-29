import { h, Component } from "preact";
import Popup from "./popup.component";

export default class FullUI extends Component {
  state = {
    showingPopup: false
  };
  render(props, state) {
    const atLeastOneOverride =
      Object.keys(window.importMapOverrides.getOverrideMap().imports).length >
      0;

    return (
      <div>
        <button
          onClick={this.toggleTrigger}
          className={`imo-unstyled imo-trigger ${
            atLeastOneOverride ? "imo-overridden" : ""
          }`}
        >
          {"{\u00B7\u00B7\u00B7}"}
        </button>
        {state.showingPopup && (
          <Popup
            close={this.toggleTrigger}
            importMapChanged={this.importMapChanged}
          />
        )}
      </div>
    );
  }
  toggleTrigger = () => {
    this.setState(prevState => ({
      showingPopup: !prevState.showingPopup
    }));
  };
  importMapChanged = () => {
    this.forceUpdate();
  };
}
