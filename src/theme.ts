import tw from "twrnc";

const palette = {
  mainBackground: tw``,
};

const theme = {
  colors: {
    mainBackground: palette.white,
    textPrimaryColor: palette.
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontWeight: "bold",
      fontSize: 34,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    defaults: {
      // We can define a default text variant here.
    },
  },
};

export default theme;
