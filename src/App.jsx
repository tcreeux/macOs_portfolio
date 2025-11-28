import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

import { Navbar, Welcome, Dock } from "@components/index";
import { Terminal } from "@windows/index";

const App = () => {
  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
      <Terminal />
    </main>
  );
};

export default App;
