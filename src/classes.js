function VerseException(message) {
  this.message = message;
  this.name = 'VerseException';
}

function BarException(message) {
  this.message = message;
  this.name = 'BarException';
}

function PhraseException(message) {
  this.message = message;
  this.name = 'PhraseException"=';
}

class Word {
  constructor(word) {
    this.word = word;
    this.rhymed = false;
    this.color = null;
  }
  rhyme(color) {
    this.rhymed = true;
    this.color = color;
  }
}

class Ink {
  constructor() {
    this.colors = ['#ED0A3F', '#FF3F34', '#FF861F', '#FBE870', '#C5E17A', '#01A368', '#76D7EA', '#0066FF', '#8359A3'];
    this.used = Array(this.colors.length).fill(false);
    this.index = 0;
  }
  dab() {
    return this.colors[this.index];
  }
  use() {
    this.index += 1;
    this.used[this.index] = true;
  }
  used() {
    return this.index >= this.colors.length;
  }
}

class Bar {
  constructor(line) {
    try {
      if (typeof line === 'string') {
        this.line = line;
      } else {
        throw new BarException('Bar variable does not consist of a string.');
      }
    } catch (e) {
      console.error(e);
    }
  }
  getLine() {
    return this.line;
  }
  ripLine() {
    return rip(this.line, false);
  }
  wordLine() {
    return rip(this.line, false).map(word => new Word(word));
  }
}

function typeCheckPhrase(bars) {
  let checks = 0;
  const check = bars.forEach((bar) => {
    if (!(bar instanceof Bar)) {
      return false;
    }
    checks += 1;
    if (checks === bars.length) {
      return true;
    }
  });
  return check;
}

class Phrase {
  constructor(bars) {
    try {
      if (bars.length !== 4) {
        throw new PhraseException('Phrase must consist of four Bars.');
      } else if (typeCheckPhrase(bars)) {
        throw new PhraseException('Phrase object must consist four Bar objects.');
      } else {
        this.bars = bars;
      }
    } catch (e) {
      console.error(e);
    }
  }
  print() {
    for (let i = 0; i < this.bars.length; i++) {
      console.log(this.bars[i].getLine());
    }
    console.log('\n');
  }
  rhyme() {
    let words = [];
    let rhymes = [];
    let crayons = new Ink();

    this.bars.forEach((bar, index) => {
      const wordArray = bar.wordLine();
      wordArray.push(new Word('\n'));
      words = words.concat(wordArray.slice());
    });

    words.forEach((word) => {
      const request = new XMLHttpRequest();
      request.open('GET', `${api}${rhymesWith}=${word.word}`, false);
      request.send(null);

      let rhymeArray = JSON.parse(request.responseText);
      rhymes.push(rhymeArray.map(result => result['word']).slice());
    });

    for (let i = 0; i < words.length; i++) {
      let dirtyBrush = false
      for (let k = i + 1; k < words.length; k++) {
        if (words[i].rhymed === words[k].rhymed && words[k].rhymed === false) {
          if ($.inArray(words[k].word, rhymes[i]) !== -1) {
            words[i].rhyme(crayons.dab());
            words[k].rhyme(crayons.dab());
            dirtyBrush = true;
          }
        }
      }
      if (dirtyBrush) {
        crayons.use();
      }
    }
    
    return words;
  }
}

function typeCheckVerse(phrases) {
  let checks = 0;
  const check = phrases.forEach((phrase) => {
    if (!(phrase instanceof Phrase)) {
      return false;
    }
    checks += 1;
    if (checks === phrases.length) {
      return true;
    }
  });
  return check;
}

class Verse {
  constructor(size, phrases) {
    try {
      if (size !== phrases.length * 4) {
        throw new VerseException('Purported size of verse does not match amount of bars given.');
      /* } else if ([16, 32, 64].indexOf(size) === -1) {
        throw new VerseException('Verse size is not of standard length.'); */
      } else if (typeCheckVerse(phrases)) {
        throw new VerseException('Phrases within the phrase array are not of the Phrase class.');
      } else {
        this.size = size;
        this.phrases = phrases;
      }
    } catch (e) {
      console.error(e);
    }
  }
  rhyme() {
    let html = '';
    this.phrases.forEach((phrase) => {
      let words = phrase.rhyme();
      words.forEach((word) => {
        if (word.word === '\n') {
          html += '<br>';
        } else {
          if (word.rhymed) {
            let highlight = `<span style="background-color: ${word.color}">${word.word}</span>`;
            html += highlight;
            html += ' ';
          } else {
            html += word.word;
            html += ' ';
          }
        }
      });
      html += '<br>'
    });
    return html;
  }
}
