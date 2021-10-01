import React from "react";

export const ImageGrid = (props) => {
  const { data } = props;

  const displayImages = (images) => {
    let renderImages;
    if (images) {
      renderImages = images.map((image, key) => (
        <span key={key} style={{ padding: "2vw" }}>
          <embed
            // #toolbar=0 is needed to remove built-in pdf viewer and make it look like an image
            src={image + "#toolbar=0"}
            width="500"
            height="500"
            type="application/pdf"
          />
        </span>
      ));
    }
    return renderImages;
  };

  return displayImages(data);
};
