import { motion, useReducedMotion } from "motion/react";
import { Link } from "react-router";

import AgentPhoto from "@/components/agent-photo";
import { aboutPage } from "@/data/about-page";
import type { Agent } from "@/data/agents";
import { fadeUpItem, revealList } from "@/lib/motion";

const copy = aboutPage.team;

function TeamPreview({ agents }: { agents: Agent[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.ul
      {...revealList(reduceMotion)}
      className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4"
    >
      {agents.map((agent) => (
        <motion.li
          key={agent.id}
          variants={reduceMotion ? undefined : fadeUpItem}
        >
          <Link
            to={`/agents/${agent.slug}`}
            className="group block rounded-xl focus-ring"
          >
            <AgentPhoto
              agent={agent}
              className="aspect-4/5 rounded-xl"
              hoverZoom
            />
            <h3 className="mt-4 type-title">{agent.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{agent.title}</p>
            <p className="text-sm text-muted-foreground">
              {copy.areas(agent.areas)}
            </p>
          </Link>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export default TeamPreview;
