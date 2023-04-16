export interface ThemeColorProps {
  color: string;
}

const ThemeColor: React.FC<ThemeColorProps> = ({ color }) => (
  <>
    <meta name="theme-color" content={color} />
    <meta name="msapplication-navbutton-color" content={color} />
    <meta name="apple-mobile-web-app-status-bar-style" content={color} />
  </>
);

export default ThemeColor;
