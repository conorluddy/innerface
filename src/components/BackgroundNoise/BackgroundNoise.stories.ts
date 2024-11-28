import type { Meta, StoryFn } from "@storybook/web-components";
// import BackgroundNoise from "./BackgroundNoise";

// More on default export: https://storybook.js.org/docs/web-components/writing-stories/introduction#default-export
export default {
  title: "Example/BackgroundNoise",
} as Meta;

// More on component templates: https://storybook.js.org/docs/web-components/writing-stories/introduction#using-args
const Template: StoryFn<unknown> = () =>
  `<background-noise>test</background-noise>`;

export const Primary = Template.bind({});

Primary.args = {};
