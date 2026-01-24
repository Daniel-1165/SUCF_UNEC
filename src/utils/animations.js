// =====================================================
// MODERN ANIMATION VARIANTS FOR SUCF UNEC
// Based on 2024 Dribbble & Mobbin trends
// =====================================================

// 1. SCROLL-TRIGGERED FADE & SLIDE (Most Common)
export const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic bezier
        }
    }
};

// 2. STAGGERED CHILDREN (For lists/grids)
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

export const staggerItem = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// 3. PARALLAX EFFECT (Different speeds for depth)
export const parallaxSlow = {
    hidden: { y: 100, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1.2,
            ease: "easeOut"
        }
    }
};

export const parallaxFast = {
    hidden: { y: 50, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut"
        }
    }
};

// 4. CARD FLIP/ROTATE (3D Effect)
export const cardFlip = {
    hidden: {
        opacity: 0,
        rotateY: -90,
        transformPerspective: 1000
    },
    visible: {
        opacity: 1,
        rotateY: 0,
        transition: {
            duration: 0.8,
            ease: [0.34, 1.56, 0.64, 1] // Bounce effect
        }
    }
};

// 5. SCALE & FADE (Zoom in effect)
export const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

// 6. SLIDE FROM SIDE (Drawer effect)
export const slideFromLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    }
};

export const slideFromRight = {
    hidden: { x: 100, opacity: 0 },
    visible: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    }
};

// 7. BLUR & FADE (Modern glassmorphism)
export const blurIn = {
    hidden: {
        opacity: 0,
        filter: "blur(10px)",
        y: 20
    },
    visible: {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut"
        }
    }
};

// 8. ELASTIC BOUNCE (Playful effect)
export const elasticBounce = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20
        }
    }
};

// 9. REVEAL MASK (Wipe effect)
export const revealMask = {
    hidden: {
        clipPath: "inset(0 100% 0 0)",
        opacity: 0
    },
    visible: {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.65, 0, 0.35, 1]
        }
    }
};

// 10. ROTATE & SCALE (Card entrance)
export const rotateScale = {
    hidden: {
        opacity: 0,
        rotate: -10,
        scale: 0.9,
        y: 50
    },
    visible: {
        opacity: 1,
        rotate: 0,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
};

// =====================================================
// USAGE EXAMPLES
// =====================================================

/*
// Example 1: Simple fade in on scroll
<motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    variants={fadeInUp}
>
    Your content here
</motion.div>

// Example 2: Staggered list
<motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={staggerContainer}
>
    {items.map((item) => (
        <motion.div key={item.id} variants={staggerItem}>
            {item.content}
        </motion.div>
    ))}
</motion.div>

// Example 3: Card with hover effect
<motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true }}
    variants={rotateScale}
    whileHover={{ 
        scale: 1.05, 
        y: -10,
        transition: { duration: 0.3 }
    }}
>
    Card content
</motion.div>
*/
