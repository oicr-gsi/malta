import React, { Key } from "react";
import ImageFadeIn from "react-image-fade-in";

export const ImageGrid = (props: { data: String[] }) => {
  const { data } = props;

  const displayImages = (images: String[]) => {
    let renderImages;
    if (images) {
      renderImages = images.map((image: String, key: Key) => (
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
