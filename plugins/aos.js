import AOS from "aos/dist/aos";
// import "aos/dist/aos.css";

// Vue.use(AOS);
export default ({
  app
}, inject) => {
  app.AOS = new AOS.init({
    once: true
  })
}
