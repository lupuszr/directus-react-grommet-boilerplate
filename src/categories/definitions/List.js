import daggy from 'daggy';

const List = daggy.taggedSum('List', {
  Cons: ['head', 'tail'],
  Nil: []
});

// Functor Instance
// Laws:
// map(a => a) is equivalent to u (identity)
// map(x => f(g(x))) is equivalent to map(g).map(f)(composition)
//
//
// map :: Functor List => List a ~> (a -> b) -> List b
List.prototype.map = function(f) {
  return this.cata({
    Cons: (head, tail) => List.Cons(f(head), tail.map(f)),
    Nil: () => List.Nil
  });
};

// Setoid instance
// Laws:
// a.equals(a) === true(reflexivity)
// a.equals(b) === b.equals(a)(symmetry)
// If a.equals(b) and b.equals(c), then a.equals(c)(transitivity)
//
//
// equals :: Setoid List => List ~> List -> Boolean
List.prototype.equals = function(ls) {
  return this.cata({
    Cons: (head, tail) => {
      ls.cata({
        Cons: (ohead, otail) => {
          if (head !== ohead) {
            return false;
          }
          return tail.equals(otail);
        },
        Nil: () => false
      });
    },
    Nil: () => {
      ls.cata({
        Cons: (_h, _o) => false,
        Nil: () => true
      });
    }
  });
};

// Semigroup instance
// concat :: Semigroup a => a ~> a -> a
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

// Monoid instance
// Laws:
// a.concat(List.empty()) is equivalent to a(right identity)
// List.empty()['fantasy-land/concat'](m) is equivalent to m(left identity)
//
// empty :: Monoid m => () -> m
List.empty = () => List.Nil;

// Natural Transformations

// from :: [a] -> List a
List.from = function(xs) {
  return xs.reduceRight((acc, x) => List.Cons(x, acc), List.Nil);
};

// toArray :: List a -> [a]
List.toArray = function(ls) {
  return ls.cata({
    Cons: (x, acc) => [x, ...List.toArray(acc)],
    Nil: () => []
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

export default List;
