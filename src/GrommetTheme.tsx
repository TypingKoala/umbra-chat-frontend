const theme = {
  global: {
    colors: {
      brand: "#228BE6",
      background: {
        dark: "#222222",
        light: "light-1",
      },
      focus: "brand",
      sentMessage: {
        dark: "brand",
        light: "brand",
      },
      receivedMessage: {
        dark: "dark-3",
        light: "light-3",
      },
      messageMetadata: {
        dark: "light-5",
        light: "dark-5",
      },
      border: {
        dark: "dark-2",
        light: "light-5",
      },
    },
    elevation: {
      dark: {
        none: "none",
        xsmall: "none",
        small: "none",
        medium: "none",
        large: "none",
        xlarge: "none",
      },
    },
    font: {
      family: "Montserrat",
      size: "18px",
      height: "20px",
    },
    input: {
      font: {
        weight: 400,
      },
    },
  },
  box: {
    extend: {
      transition: "all 0.1s linear",
    },
  },
  tip: {
    content: {
      background: {
        dark: "light-1",
        light: "dark-1",
      },
      width: "fit-content",
    },
  },
  anchor: {
    color: "brand"
  }
};

export default theme;