import { Component } from "react";
import { AppContext } from "../context";

class Attributes extends Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { attributes, selectedAttributes, handleClickAttributeBtns, onCartProduct } =
      this.props;
    const { isDarkTheme } = this.context;

    return (
      <div className="attributes-container">
        {attributes.map((attribute) => {
          const { id, name, items, type } = attribute;
          if (type === "swatch") {
            return (
              <div
                className="attribute-container"
                key={`${id}_attribute_container_color_swatch`}
              >
                <div
                  className="attribute-title"
                  key={`${id}_attribute_title_color_swatch`}
                >
                  {name}
                </div>
                {selectedAttributes &&
                  selectedAttributes.Color &&
                  attribute.items.map((item) => {

                    if (item.value === selectedAttributes.Color) {
                      return (
                        <p className="color-display-value">
                          {item.displayValue}
                        </p>
                      );
                    } else {
                      return null;
                    }
                  })}
                <div
                  data-attribute-name={id}
                  className="attribute-options color-swatch-container"
                  key={`${id}_${name}_attribute_options`}
                >
                  {items.map((item) => {
                    const { id, value } = item;
                    let isOptionChosen;
                    isOptionChosen = item.value === selectedAttributes[attribute.name];

                    return (
                      <>
                        <button
                          className={`color-swatch option-btn ${isOptionChosen && 'clicked'}`}
                          style={{
                            backgroundColor: value,
                          }}
                          key={`${id}_color_swatch_attribute`}
                          value={value}
                          onClick={(e) => onCartProduct ? null : handleClickAttributeBtns(e)}
                          data-clicked="false"
                          data-attribute-type={type}
                        ></button>
                      </>
                    );
                  })}
                </div>
              </div>
            );
          } else if (type !== "swatch") {
            return (
              <>
                <div
                  className="attribute-container"
                  key={`${id}_attribute_container`}
                >
                  <div
                    className="attribute-title-options"
                    key={`${id}_attribute_title_options`}
                  >
                    <div
                      className="attribute-title"
                      key={`${id}_${name}_attribute_title`}
                    >
                      {name}
                    </div>
                    <div
                      data-attribute-name={id}
                      className="attribute-options"
                      key={`${id}_${name}_attribute_options`}
                    >
                      {items.map((item) => {
                        const { value, displayValue, id } = item;
                        let isOptionChosen;
                        isOptionChosen = item.value === selectedAttributes[attribute.name];

                        if (isDarkTheme) {
                          return (
                            <button
                              className={`option-btn ${isOptionChosen && "clicked"}`}
                              value={value}
                              onClick={handleClickAttributeBtns}
                              key={`${id}_attribute_description`}
                              data-clicked="false"
                              data-attribute-type={type}
                            >
                              {displayValue}
                            </button>
                          )
                        } else if (!isDarkTheme) {
                          return (
                            <button
                              className="option-btn"
                              value={value}
                              onClick={handleClickAttributeBtns}
                              key={`${id}_attribute_option_btn`}
                              data-clicked="false"
                              data-attribute-type={type}
                              style={{
                                backgroundColor: isOptionChosen
                                  ? "#000"
                                  : "#fff",
                                color: isOptionChosen
                                  ? "#fff"
                                  : "#000",
                                border: isOptionChosen
                                  ? "1px solid #fff"
                                  : "1px solid #000",
                              }}
                            >
                              {displayValue}
                            </button>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </>
            );
          }
          return null;
        })}
      </div>
    );
  }
}

export default Attributes;
