import daggy from 'daggy';
import concat from 'folktale/fantasy-land/concat';

const Writer = daggy.tagged('Writer', ['a', 'w']);

// Functor Instance
// Laws:
// map(a => a) is equivalent to u (identity)
// map(x => f(g(x))) is equivalent to map(g).map(f)(composition)
//
//
// map :: Functor Writer => Writer (a, w) ~> (a -> b) -> Writer (b, w)
Writer.prototype.map = function(f) {
  return Writer(f(this.a), this.w);
};

// Monad Instance
// Laws
// M['fantasy-land/of'](a)['fantasy-land/chain'](f) is equivalent to f(a)(left identity)
// m['fantasy-land/chain'](M['fantasy-land/of']) is equivalent to m(right identity)

// chain :: Monad Writer => Writer (a, w) ~> (a -> Writer (b, w')) -> Writer (b, w')
Writer.prototype.chain = function(f) {
  const { a, w: wp } = f(this.a);
  return Writer(a, concat(this.w, wp));
};

Writer.of = function(a, w = '') {
  return Writer(a, w);
};
