import { ReactElement, useState } from 'react';
import 'dayjs/plugin/customParseFormat';
export const App = (): ReactElement => {
  const [state, setState] = useState(0);
  const handleClick = () => console.log(state);

  return (
    <div>
      <div>
        <button onClick={() => setState(state + 1)}>상태 업데이트 버튼</button>
        <h1>Hi</h1>
        <h2>{state}</h2>
      </div>
      <div>
        <button onClick={handleClick}>Click Me</button>
      </div>
    </div>
  );
};
