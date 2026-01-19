import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import { Dimensions, FlatList, View } from "react-native";

const { width, height } = Dimensions.get("window");

type CarouselItem = {
  id: string;
  component: React.ReactNode;
};

type CarouselProps = {
  data: CarouselItem[];
  onEnd?: () => void;
};

export type CarouselRef = {
  goNext: () => void;
};

const Carousel = forwardRef<CarouselRef, CarouselProps>(
  ({ data, onEnd }, ref) => {
    const flatListRef = useRef<FlatList>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const goNext = () => {
      if (activeIndex < data.length - 1) {
        const nextIndex = activeIndex + 1;

        // Trick: jump to previous index without animation, then animate to next
        flatListRef.current?.scrollToOffset({
          offset: (nextIndex - 1) * width,
          animated: false,
        });
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: nextIndex * width,
            animated: true,
          });
        }, 0);

        setActiveIndex(nextIndex);
      } else {
        if (onEnd) onEnd();
      }
    };

    useImperativeHandle(ref, () => ({
      goNext,
    }));

    return (
      <View style={{ height }}>
        <FlatList
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ width, height }}>{item.component}</View>
          )}
        />
      </View>
    );
  },
);

export default Carousel;
