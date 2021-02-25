module.exports = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "https://hackclub.com",
        permanent: true,
      },
    ];
  },
};
