import { blogPublishingReceiverChecklist } from "../constants/publishing/blogPublishingReceiverChecklist";

export const BlogPublishingReceiverChecklist = () => {
  return (
    <ul className="grid gap-2 text-sm leading-6 text-black">
      {blogPublishingReceiverChecklist.map((item) => (
        <li className="flex gap-2" key={item}>
          <span aria-hidden="true">-</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
};
