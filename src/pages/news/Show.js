import React, { useState, useEffect } from 'react';
import { Heading, Image } from 'grommet';
import concat from 'folktale/fantasy-land/concat';
import empty from 'folktale/fantasy-land/empty';
import daggy from 'daggy';

const List = daggy.taggedSum('List', {
  Cons: ['head', 'tail'],
  Nil: []
});

List.prototype.map = function(f) {
  return this.cata({
    Cons: (head, tail) => List.Cons(f(head), tail.map(f)),

    Nil: () => List.Nil
  });
};

// A "static" method for convenience.
List.from = function(xs) {
  return xs.reduceRight((acc, x) => List.Cons(x, acc), List.Nil);
};

// And a conversion back for convenience!
List.prototype.toArray = function() {
  return this.cata({
    Cons: (x, acc) => [x, ...acc.toArray()],

    Nil: () => []
  });
};

List.prototype.concat = function(a) {
  return this.cata({
    Cons: (_h, _t) =>
      a.cata({
        Cons: (hd, tail) => List.Cons(hd, this.concat(tail)),
        Nil: () => this
      }),
    Nil: () => a
  });
};
// Monad a => Ma -> (a -> Mb) -> Mb
List.prototype.chain = function(fn) {
  return this.cata({
    Cons: (head, tail) =>
      fn(head).cata({
        Cons: (hf, _tail) => List.Cons(hf, tail.chain(fn)),
        Nil: () => List.Nil
      }),
    Nil: () => List.Nil
  });
};

// [3, 4, 5]
console.log(List, List.from([1, 2, 3]));

String.prototype.empty = () => '';

// prependMonoidIfNotNeutral :: Monoid a => a -> a -> a
const prependMonoidIfNotNeutral = p => a => (a !== empty(a) ? concat(p, a) : a);

function useFetchHook({
  host,
  env = '_',
  action,
  props = [],
  id = '',
  initialState
}) {
  const [data, setData] = useState(initialState);

  const fields = prependMonoidIfNotNeutral('?fields=')(props.join(','));
  const url = ''
    .concat(host)
    .concat('/')
    .concat(env)
    .concat('/')
    .concat(action)
    .concat('/')
    .concat(id)
    .concat(fields);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(json => setData(json.data));

    return () => console.log('fing');
  }, [url]);
  return data;
}
const initialState = {
  created_on: undefined,
  title: '',
  img: { filename: undefined }
};
function ShowNews({
  match: {
    params: { id }
  }
}) {
  // const [data, setData] = useState({ created_on: undefined, title: '', img: { filename: undefined } });

  const data = useFetchHook({
    env: '_',
    host: 'http://localhost:7000',
    action: 'items/news',
    id,
    initialState,
    props: ['id', 'title', 'img.filename', 'body', 'created_on']
  });
  // useEffect(async () => {
  //   const result = await fetch(
  //     `http://localhost:7000/_/items/news/${id}?fields=id,title,img.filename,body,created_on`
  //   );
  //   const json = await result.json();
  //   console.log(json)
  //   setData(json.data);
  // }, []);

  return (
    <>
      <Heading strong>kita {data.title}</Heading>
      {data.created_on}
      <Image
        fit="cover"
        src={`http://localhost:7000/uploads/_/originals/${data.img.filename}`}
      />
      <div dangerouslySetInnerHTML={{ __html: data.body }} />
    </>
  );
}

export default ShowNews;
