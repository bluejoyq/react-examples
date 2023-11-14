import {
  ButtonHTMLAttributes,
  ReactElement,
  useCallback,
  useState,
} from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
const Button = (props: ButtonProps): ReactElement => {
  return <button {...props} />;
};

export const App = (): ReactElement => {
  const [state, setState] = useState(0);
  const handleClick = () => console.log(state);
  const handleClickWithUseCallback = useCallback(() => console.log(state), []);

  return (
    <div>
      <div>
        <button onClick={() => setState(state + 1)}>상태 업데이트 버튼</button>
        <h1>Hi</h1>
        <h2>{state}</h2>
      </div>
      <div>
        <Button onClick={handleClick}>Click Me</Button>
        <Button onClick={handleClickWithUseCallback}>Click Me</Button>
        <button onClick={handleClick}>Click Me</button>
      </div>
    </div>
  );
};
