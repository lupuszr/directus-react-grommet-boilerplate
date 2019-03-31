import daggy from 'daggy';
import concat from 'folktale/fantasy-land/concat';

const State = daggy.tagged('State', ['s', 'a']);

// Functor Instance
// Laws:
// map(a => a) is equivalent to u (identity)
// map(x => f(g(x))) is equivalent to map(g).map(f)(composition)
//
//
// map :: Functor Writer => Writer (a, w) ~> (a -> b) -> Writer (b, w)
State.prototype.map = function(f) {
  return State(f(this.a), this.w);
};

// Monad Instance
// Laws
// M['fantasy-land/of'](a)['fantasy-land/chain'](f) is equivalent to f(a)(left identity)
// m['fantasy-land/chain'](M['fantasy-land/of']) is equivalent to m(right identity)
