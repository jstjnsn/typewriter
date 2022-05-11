import "./style.css";

type QueueItem = () => Promise<void>;

class Typewriter {
  #queue: QueueItem[] = [];
  #element: HTMLElement;
  #loop: boolean;
  #typingSpeed: number;
  #deletingSpeed: number;

  constructor(
    element: HTMLElement,
    { loop = false, typingSpeed = 50, deletingSpeed = 50 } = {}
  ) {
    this.#element = element;
    this.#loop = loop;
    this.#typingSpeed = typingSpeed;
    this.#deletingSpeed = deletingSpeed;
  }

  type(text: string) {
    this.#addToQueue((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        this.#element.append(text[i]);
        i++;
        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, this.#typingSpeed);
    });
    return this;
  }

  deleteCharacters(amount: number) {
    this.#addToQueue((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        this.#element.innerText = this.#element.innerText.substring(
          0,
          this.#element.innerText.length - 1
        );
        i++;
        if (i >= amount) {
          clearInterval(interval);
          resolve();
        }
      }, this.#deletingSpeed);
    });
    return this;
  }

  deleteAll(deletingSpeed?: number) {
    this.#addToQueue((resolve) => {
      let i = 0;
      const interval = setInterval(() => {
        this.#element.innerText = this.#element.innerText.substring(
          0,
          this.#element.innerText.length - 1
        );
        i++;
        if (this.#element.innerText.length === 0) {
          clearInterval(interval);
          resolve();
        }
      }, deletingSpeed ?? this.#deletingSpeed);
    });
    return this;
  }

  pauseFor(duration: number) {
    this.#addToQueue((resolve) => {
      setTimeout(resolve, duration);
    });
    return this;
  }

  async start() {
    let callback = this.#queue.shift();
    while (callback != null) {
      await callback();
      if (this.#loop) this.#queue.push(callback);
      callback = this.#queue.shift();
    }
  }

  #addToQueue(cb: (resolve: () => void) => void) {
    this.#queue.push(() => new Promise(cb));
  }
}

const typingElement = document.querySelector(".typing");

const typewriter = new Typewriter(typingElement as HTMLElement, {
  loop: true,
  typingSpeed: 100,
  deletingSpeed: 100,
});

typewriter
  .type("Hello there")
  .deleteCharacters(11)
  .pauseFor(1000)
  .type("Nothing to see here...\n\n")
  .pauseFor(2000)
  .type("or is there?")
  .pauseFor(2000)
  .deleteAll()
  .start();
