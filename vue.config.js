module.exports = {
  devServer: {
    proxy: {
      "/api/": {
        target: "http://localhost:9090/",
        changeOrigin: true, // needed for virtual hosted sites
        ws: true, // proxy websockets
        pathRewrite: {
          "^/api/": "/"
        }
      }
    },
    port: 8080
  }
};
