import { Component } from "react";

class Attributes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { attributes, selectedAttributes, handleClickAttributeBtns } =
      this.props;
    return (
      <div className="attributes-container">
        {attributes.map((attribute) => {
          const { id, name, items, type } = attribute;
          if (type === "swatch") {
            return (
              <div
                className="attribute-container"
                key={`${id}_pdp_attribute_container`}
              >
                <div
                  className="attribute-title"
                  key={`${id}_pdp_attribute_title`}
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
                  key={`${id}_${name}_pdp_attribute_options`}
                >
                  {attribute.items.map((item) => {
                    const { id, value } = item;
                    return (
                      <>
                        <button
                          className="color-swatch option-btn"
                          style={{
                            backgroundColor: value,
                          }}
                          key={`${id}_color_swatch_product_card`}
                          value={value}
                          onClick={handleClickAttributeBtns}
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
                  key={`${id}_pdp_attribute_container`}
                >
                  <div
                    className="attribute-title"
                    key={`${id}_${name}_pdp_attribute_title`}
                  >
                    {name}
                  </div>
                  <div
                    data-attribute-name={id}
                    className="attribute-options"
                    key={`${id}_${name}_pdp_attribute_options`}
                  >
                    {items.map((item) => {
                      const { value, displayValue, id } = item;
                      return (
                        <button
                          className="option-btn"
                          value={value}
                          onClick={handleClickAttributeBtns}
                          key={`${id}_attribute_description`}
                          data-clicked="false"
                          data-attribute-type={type}
                        >
                          {displayValue}
                        </button>
                      );
                    })}
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
