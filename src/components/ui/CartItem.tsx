"use client";

import { motion } from "framer-motion";

import type { CartItem as CartItemType } from "@/types/cart";

import { Caption, Heading } from "@/components/primitives/Typography";
import { useCartActions } from "@/hooks/useCartActions";
import { fadeInUp } from "@/lib/motion";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useCartActions();

  return (
    <motion.article
      className="cart-item"
      layout
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
    >
      <div className="cart-item__media">
        <img alt={item.name} className="cart-item__image" src={item.thumbnail} />
      </div>

      <div className="cart-item__body">
        <div className="cart-item__copy">
          <Caption>{item.brand}</Caption>
          <Heading as="h3" className="cart-item__title">
            {item.name}
          </Heading>
          <span className="cart-item__meta">Size: {item.size}</span>
        </div>

        <div className="cart-item__footer">
          <div className="cart-item__price-row">
            <span className="cart-item__price">${item.price}</span>
            <span className="cart-item__original">${item.originalPrice}</span>
          </div>
          <button
            className="cart-item__remove"
            onClick={() =>
              removeFromCart({
                name: item.name,
                productId: item.productId,
                size: item.size
              })
            }
            type="button"
          >
            Remove
          </button>
        </div>
      </div>
    </motion.article>
  );
}
