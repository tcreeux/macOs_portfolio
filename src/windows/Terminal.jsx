import React from "react";
import { Check, Flag } from "lucide-react";
import WindowWrapper from "@hoc/WindowWrapper";
import { techStack } from "@constants/index";
import { WindowControlls } from "@components/index";

const Terminal = () => {
  return (
    <div id="terminal">
      <div id="window-header">
        <WindowControlls target="terminal" />
        <h2>Tech Stack</h2>
      </div>

      <div className="techstack">
        <p>
          <span className="font-bold">@tom %</span>
          show tech stack
        </p>

        <div className="label">
          <p className="w-32">Category</p>
          <p>Technologies</p>
        </div>

        <ul className="content">
          {techStack.map(({ category, items }) => (
            <li key={category} className="flex items-center">
              <Check className="check" size={20} />
              <h3>{category}</h3>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>
                    {item}
                    {i < items.length - 1 ? "," : ""}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
        <div className="footnote">
          <p>
            <Check className="check" size={20} />
            <span>5 of 5stacks loaded successfully (100%)</span>
          </p>

          <p className="text-black">
            <Flag size={20} fill="black" />
            Render time: 6ms
          </p>
        </div>
      </div>
    </div>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
