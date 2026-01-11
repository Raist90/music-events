import { motion } from "motion/react";
import { createPortal } from "react-dom";

type Props = {
  children: React.ReactNode;
  ref?: React.Ref<HTMLDivElement>;
};

export default function Panel({ children, ref }: Props) {
  return createPortal(
    <motion.div
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="fixed z-50 w-full bottom-0 border-t border-input bg-background/85 backdrop-blur-md"
    >
      <div className="w-full space-y-8 p-4" {...(ref && { ref })}>
        {children}
      </div>
    </motion.div>,
    document.body,
  );
}
