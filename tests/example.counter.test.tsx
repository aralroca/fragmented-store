import {Component, useEffect, useRef, useState} from 'react';
import {render, waitFor, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@babel/polyfill';

import createStore from '../package/index';

describe('Example: Counter', () => {
  it('should work with a simple counter', () => {
    type Count = { count: number };
    const initialStore = {count: 0};
    const {useStore} = createStore<Count>(initialStore);

    function Counter() {
      const [count, setCount] = useStore.count();
      return (
        <div>
          <h1>{count}</h1>
          <button onClick={() => setCount((v) => v + 1)}>+</button>
          <button onClick={() => setCount((v) => v - 1)}>-</button>
          <button onClick={() => setCount(initialStore.count)}>reset</button>
        </div>
      );
    }

    function DisplayCounter() {
      const [count] = useStore.count();
      return <p data-testid="number">{count}</p>;
    }

    render(
        <>
          <Counter />
          <DisplayCounter />
        </>,
    );

    expect(screen.getByRole('heading').textContent).toBe('0');

    // Inc
    userEvent.click(screen.getByText('+'));
    expect(screen.getByRole('heading').textContent).toBe('1');
    expect(screen.getByTestId('number').textContent).toContain('1');

    // Inc again
    userEvent.click(screen.getByText('+'));
    expect(screen.getByRole('heading').textContent).toBe('2');
    expect(screen.getByTestId('number').textContent).toContain('2');

    // Dec
    userEvent.click(screen.getByText('-'));
    expect(screen.getByRole('heading').textContent).toBe('1');
    expect(screen.getByTestId('number').textContent).toContain('1');

    // Inc again
    userEvent.click(screen.getByText('+'));
    expect(screen.getByRole('heading').textContent).toBe('2');
    expect(screen.getByTestId('number').textContent).toContain('2');

    // Reset
    userEvent.click(screen.getByText('reset'));
    expect(screen.getByRole('heading').textContent).toBe('0');
    expect(screen.getByTestId('number').textContent).toContain('0');
  });

  it('should work with a counter in a class component', async () => {
    const initialStore = {count: 0};

    type storeType = {
      count: number;
    }

    const {useStore, withStore} = createStore<storeType>(initialStore);

    type Props = {
      store: ReturnType<typeof useStore.count>;
    }

    class Counter extends Component<Props> {
      render() {
        const [count, setCount] = this.props.store;
        return (
          <div>
            <h1>{count}</h1>
            <button onClick={() => setCount((v) => v + 1)}>+</button>
            <button onClick={() => setCount((v) => v - 1)}>-</button>
            <button onClick={() => setCount(initialStore.count)}>reset</button>
          </div>
        );
      }
    }

    const CounterWithStore = withStore.count(Counter);

    function DisplayCounter() {
      const [count] = useStore.count();
      return <p data-testid="number">{count}</p>;
    }

    render(
        <>
          <CounterWithStore />
          <DisplayCounter />
        </>,
    );

    expect(screen.getByRole('heading').textContent).toBe('0');

    // Inc
    userEvent.click(screen.getByText('+'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('1');
    expect(screen.getByTestId('number').textContent).toContain('1');

    // Inc again
    userEvent.click(screen.getByText('+'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('2');
    expect(screen.getByTestId('number').textContent).toContain('2');

    // Dec
    userEvent.click(screen.getByText('-'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('1');
    expect(screen.getByTestId('number').textContent).toContain('1');

    // Inc again
    userEvent.click(screen.getByText('+'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('2');
    expect(screen.getByTestId('number').textContent).toContain('2');

    // Reset
    userEvent.click(screen.getByText('reset'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('0');
    expect(screen.getByTestId('number').textContent).toContain('0');
  });

  it('should work with a counter in a class component: with all store', async () => {
    type Count = { count: number };
    const initialStore = {count: 0};
    const {useStore, withStore} = createStore<Count>(initialStore);

    type Props = {
      store: ReturnType<typeof useStore>;
    }

    class Counter extends Component<Props> {
      render() {
        const [store, setStore] = this.props.store;
        return (
          <div>
            <h1>{store.count}</h1>
            <button
              onClick={() => setStore((s) => ({...s, count: s.count + 1}))}
            >
              +
            </button>
            <button
              onClick={() => setStore((s) => ({...s, count: s.count - 1}))}
            >
              -
            </button>
            <button onClick={() => setStore(initialStore)}>reset</button>
          </div>
        );
      }
    }

    const CounterWithStore = withStore(Counter);

    function DisplayCounter() {
      const [count] = useStore.count();
      return <p data-testid="number">{count}</p>;
    }

    render(
        <>
          <CounterWithStore />
          <DisplayCounter />
        </>,
    );

    expect(screen.getByRole('heading').textContent).toBe('0');

    // Inc
    userEvent.click(screen.getByText('+'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('1');
    expect(screen.getByTestId('number').textContent).toContain('1');

    // Inc again
    userEvent.click(screen.getByText('+'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('2');
    expect(screen.getByTestId('number').textContent).toContain('2');

    // Dec
    userEvent.click(screen.getByText('-'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('1');
    expect(screen.getByTestId('number').textContent).toContain('1');

    // Inc again
    userEvent.click(screen.getByText('+'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('2');
    expect(screen.getByTestId('number').textContent).toContain('2');

    // Reset
    userEvent.click(screen.getByText('reset'));
    await waitFor(() => screen.getByRole('heading'));
    expect(screen.getByRole('heading').textContent).toBe('0');
    expect(screen.getByTestId('number').textContent).toContain('0');
  });

  it('should work with a counter: as a new value (not defined on the store)',
      async () => {
        type storeType = {
          anotherValue: string,
          count?: number
        }

        const {useStore} = createStore<storeType>({anotherValue: ''});

        function Counter() {
          const initialCountValue = useRef<number>();
          const [count, setCount] = useStore.count();

          useEffect(() => {
            if (
              initialCountValue.current === undefined &&
              count !== undefined
            ) {
              initialCountValue.current = count;
            }
          }, [count]);

          return (
            <div>
              <h1>{count}</h1>
              <button onClick={() => setCount((v = 0) => v + 1)}>+</button>
              <button onClick={() => setCount((v = 0) => v - 1)}>-</button>
              <button
                onClick={() => setCount(initialCountValue.current)}
              >
                reset
              </button>
            </div>
          );
        }

        function DisplayCounter() {
          const [anotherValue] = useStore.anotherValue(
              'Should not be overwritted (only for initial values)',
          );
          const [count] = useStore.count(0); // initial value
          return (
            <>
              <p data-testid="number">{count}</p>
              <p data-testid="anotherValue">{anotherValue}</p>
            </>
          );
        }

        render(
            <>
              <Counter />
              <DisplayCounter />
            </>,
        );

        expect(screen.getByRole('heading').textContent).toBe('0');

        // Inc
        userEvent.click(screen.getByText('+'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('1');
        expect(screen.getByTestId('number').textContent).toContain('1');

        // Inc again
        userEvent.click(screen.getByText('+'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('2');
        expect(screen.getByTestId('number').textContent).toContain('2');

        // Dec
        userEvent.click(screen.getByText('-'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('1');
        expect(screen.getByTestId('number').textContent).toContain('1');

        // Inc again
        userEvent.click(screen.getByText('+'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('2');
        expect(screen.getByTestId('number').textContent).toContain('2');

        // Reset
        userEvent.click(screen.getByText('reset'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('0');
        expect(screen.getByTestId('number').textContent).toContain('0');

        // Another value
        expect(screen.getByTestId('anotherValue').textContent).toBe('');
      });
  it('should work with a counter in a class component: as a new value (not defined on the store)',
      async () => {
        type storeType = {
          counter: {
            count: number
          }
        }

        const {useStore, withStore} = createStore<storeType>();
        const initialCount = 0;

        type Props = {
          store: ReturnType<typeof useStore.counter.count>;
        }

        class Counter extends Component<Props> {
          // Forcing update to verify that the initial value is not overwritten
          componentDidMount() {
            this.forceUpdate();
          }
          render() {
            const [count, setCount] = this.props.store;
            return (
              <div>
                <h1>{count}</h1>
                <button onClick={() => setCount((v) => v + 1)}>+</button>
                <button onClick={() => setCount((v) => v - 1)}>-</button>
                <button onClick={() => setCount(initialCount)}>reset</button>
              </div>
            );
          }
        }

        const CounterWithStore = withStore.counter.count(Counter, initialCount);

        function DisplayCounter() {
          const [count] = useStore.counter.count();
          return <p data-testid="number">{count}</p>;
        }

        render(
            <>
              <CounterWithStore />
              <DisplayCounter />
            </>,
        );

        expect(screen.getByRole('heading').textContent).toBe('0');

        // Inc
        userEvent.click(screen.getByText('+'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('1');
        expect(screen.getByTestId('number').textContent).toContain('1');

        // Inc again
        userEvent.click(screen.getByText('+'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('2');
        expect(screen.getByTestId('number').textContent).toContain('2');

        // Dec
        userEvent.click(screen.getByText('-'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('1');
        expect(screen.getByTestId('number').textContent).toContain('1');

        // Inc again
        userEvent.click(screen.getByText('+'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('2');
        expect(screen.getByTestId('number').textContent).toContain('2');

        // Reset
        userEvent.click(screen.getByText('reset'));
        await waitFor(() => screen.getByRole('heading'));
        expect(screen.getByRole('heading').textContent).toBe('0');
        expect(screen.getByTestId('number').textContent).toContain('0');
      });

  it('Should increase the value using a form with getStore', async () => {
    type Count = { count: number };
    const initialStore = {count: 0};
    const {useStore, getStore} = createStore<Count>(initialStore);

    function CountForm() {
      const [newCount, setNewCount] = useState(0);

      function saveIncreasedCount(e: React.FormEvent) {
        e.preventDefault();
        const [count, setCount] = getStore.count();
        if (newCount > count) setCount(newCount);
      }

      return (
        <form onSubmit={saveIncreasedCount}>
          <input
            value={newCount}
            min={0}
            max={10}
            data-testid="input"
            onChange={(e) => setNewCount(e.target.valueAsNumber)}
            type="number"
          />
          <button>Save</button>
        </form>
      );
    }

    function CountValue() {
      const [count] = useStore.count();
      return <p data-testid="number">{count}</p>;
    }

    render(
        <>
          <CountValue />
          <CountForm />
        </>,
    );

    // Increase to 1 using the form
    userEvent.type(screen.getByTestId('input'), '1');
    expect(screen.getByTestId('number').textContent).toContain('0');
    userEvent.click(screen.getByText('Save'));
    expect(screen.getByTestId('number').textContent).toContain('1');

    // Increase to 10 using the form
    userEvent.type(screen.getByTestId('input'), '10');
    expect(screen.getByTestId('number').textContent).toContain('1');
    userEvent.click(screen.getByText('Save'));
    expect(screen.getByTestId('number').textContent).toContain('10');

    // Decrease should not work (the component only allows to increase)
    userEvent.type(screen.getByTestId('input'), '9');
    expect(screen.getByTestId('number').textContent).toContain('10');
    userEvent.click(screen.getByText('Save'));
    // not saved
    expect(screen.getByTestId('number').textContent).toContain('10');
  });
});
