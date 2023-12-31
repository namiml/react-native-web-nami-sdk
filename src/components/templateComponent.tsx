import React, { useContext, useMemo } from "react";

import type { TComponent, TConditionalComponent } from "react-nami";
import {
  conditionComponentMatches,
  interpolate,
  withOverrides,
} from "react-nami";

import Button from "./button.component";
import Container from "./Container";
import FlexProductContainer from "./FlexProductContainer";
import Image from "./Image";
import ProductContainer from "./ProductContainer";
import SegmentPicker from "./SegmentPicker";
import { SegmentPickerItem } from "./SegmentPickerItem";
import Spacer from "./spacer.component";
import Stack from "./Stack";
import SvgImage from "./SvgImage";
import { Text, Symbol, TextList } from "./text.component";
import Video from "./Video";
import { ComponentContext, FeaturedContext } from "../contexts/context";

type ComponentProps<T> = {
  component: T;
  inFocusedState?: boolean;
  groupId: string | null;
};

type ComponentFC = React.FC<{
  component: any;
  children?: React.ReactNode;
  inFocusedState?: boolean;
  groupId: string | null;
}>;

type ComponentsMapType = { [key: string]: ComponentFC };

const COMPONENTS_MAP: ComponentsMapType = {
  spacer: Spacer,
  symbol: Symbol,
  button: Button,
  text: Text,
  stack: Stack,
  "text-list": TextList,
  container: Container,
  productContainer: ProductContainer,
  flexProductContainer: FlexProductContainer,
  image: Image,
  segmentPicker: SegmentPicker,
  segmentPickerItem: SegmentPickerItem,
  videoUrl: Video,
  svgImage: SvgImage,
  // carouselContainer: CarouselContainer,
};

export default function TemplateComponent({
  component,
  inFocusedState,
  groupId,
}: ComponentProps<TComponent | TConditionalComponent>) {
  const featured = useContext(FeaturedContext);
  const upperContext = useContext(ComponentContext);

  const context = useMemo(() => {
    if (!component.flag && !component.context) return upperContext;
    const output = component.context
      ? component.context
      : { flag: component.flag };
    return { ...(upperContext || {}), ...output };
  }, [component.flag, component.context, upperContext]);

  if (component.component === "condition" || !!component.conditionAttributes) {
    component = interpolate(component, {
      sku: {
        featured,
      },
      context,
    });
  }

  if (component.component === "condition") {
    if (!conditionComponentMatches(component)) return null;
    const children = component.components?.map(
      (child: any, i: React.Key | null | undefined) => (
        <TemplateComponent
          key={i}
          component={child}
          inFocusedState={inFocusedState}
          groupId={groupId}
        />
      )
    );
    return <>{children}</>;
  }

  if (!(component?.component in COMPONENTS_MAP)) {
    return null;
  }

  component = withOverrides(component);
  const Component = COMPONENTS_MAP[component?.component];
  const components = "components" in component ? component.components : [];
  const children = components.map(
    (child: any, i: React.Key | null | undefined) => (
      <TemplateComponent
        key={i}
        component={child}
        inFocusedState={inFocusedState}
        groupId={groupId}
      />
    )
  );

  const output = (
    <Component
      component={component}
      inFocusedState={inFocusedState}
      groupId={groupId}
    >
      {children}
    </Component>
  );
  if (!context) return output;
  return (
    <ComponentContext.Provider value={context}>
      {output}
    </ComponentContext.Provider>
  );
}
