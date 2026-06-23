"use client";

import { useState } from "react";
import { TopicDiscoveryButton } from "./TopicDiscoveryButton";
import { TopicDiscoveryDialog } from "./TopicDiscoveryDialog";
import type { DiscoverTopicIdeas } from "../types/topicDiscovery/DiscoverTopicIdeas";

type TopicDiscoveryLauncherProps = {
  addTopic: (keyword: string, notes?: string) => Promise<void> | void;
  discoverTopicIdeas: DiscoverTopicIdeas;
};

export const TopicDiscoveryLauncher = ({
  addTopic,
  discoverTopicIdeas,
}: TopicDiscoveryLauncherProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <TopicDiscoveryButton onOpen={() => setIsOpen(true)} />
      <TopicDiscoveryDialog
        addTopic={addTopic}
        discoverTopicIdeas={discoverTopicIdeas}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
