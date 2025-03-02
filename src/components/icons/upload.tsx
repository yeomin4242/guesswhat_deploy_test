import { IconSvgProps } from "@/types/icons";

export const UploadIcon = ({
  size = 24,
  width,
  height,
  ...props
}: IconSvgProps) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
    fill="none"
  >
    <path
      // opacity="0.5"
      d="M17 9C19.175 9.01211 20.3529 9.10856 21.1213 9.87694C22 10.7556 22 12.1698 22 14.9983V15.9983C22 18.8267 22 20.2409 21.1213 21.1196C20.2426 21.9983 18.8284 21.9983 16 21.9983H8C5.17157 21.9983 3.75736 21.9983 2.87868 21.1196C2 20.2409 2 18.8267 2 15.9983L2 14.9983C2 12.1698 2 10.7556 2.87868 9.87694C3.64706 9.10856 4.82497 9.01211 7 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
