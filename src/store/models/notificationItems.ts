export interface INotificationItems {
  show: boolean;
  title: string;
  description: string;
  buttons: IButton[];
}

export interface IButton {
  variant: "primary" | "secondary" | "success" | "warning" | "danger" | "info" | "light" | "dark" | "link";
  text: string;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
}

export interface ISetNotification {
  title: string;
  description: string;
  buttons: IButton[];
}
