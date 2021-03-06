var test = require("tape")
    , reduce = require("..")

test("reduce calls each iterator", function (t) {
    var item = createItem()
        , timesCalled = 0
        , accumulator = { key: '' }
        , expectedKeys = ['a', 'b', 'c']
        , expectedValues = ['a1', 'b1', 'c1']
        , expectedAccumulatorKeys = ['', 'a1', 'a1b1', 'a1b1c1']
        , iterator = function (acc, value, key, list) {
            var expectedKey = expectedKeys[timesCalled]
                , expectedValue = expectedValues[timesCalled]
                , expectedAccumulatorKey = expectedAccumulatorKeys[timesCalled]

            t.equal(value, expectedValue, 'value ' + value + ' does not match ' + expectedValue)
            t.equal(key, expectedKey, 'key ' + key + ' does not match ' + expectedKey)
            t.equal(list, item, 'list arg is not correct')
            t.equal(acc.key, expectedAccumulatorKey, 'accumulator key ' + acc.key + ' does not match ' + expectedAccumulatorKey)

            timesCalled += 1
            acc.key += value
            return acc
        }

    var result = reduce(item, iterator, accumulator)

    t.equal(timesCalled, 3, "iterator was not called thrice")
    t.deepEqual(result, { key: 'a1b1c1' }, 'result is incorrect');
return t.end();
    t.deepEqual(iterator.args[0], [{
        key: "a1b1c1"
    }, "a1", "a", item], "iterator called with wrong arguments")
    t.deepEqual(iterator.args[1], [{
        key: "a1b1c1"
    }, "b1", "b", item], "iterator called with wrong arguments")
    t.deepEqual(iterator.args[2], [{
        key: "a1b1c1"
    }, "c1", "c", item], "iterator called with wrong arguments")
    t.deepEqual(result, {
        key: "a1b1c1"
    })

    t.end()
})

test("reduce calls iterator with correct this value", function (t) {
    var item = createItem()
        , thisValue = {}
        , iterator = function () {
              t.equal(this, thisValue, 'this value is incorrect');
          }

    reduce(item, iterator, thisValue, {})

    t.end()
})

test("reduce reduces with first value if no initialValue", function (t) {
    var list = [1, 2]
        , iterator = function (sum, v) {
            return sum + v
        }

    var result = reduce(list, iterator)

    t.equal(result, 3, "result is incorrect")

    t.end()
})

function createItem() {
    return {
        a: "a1"
        , b: "b1"
        , c: "c1"
    }
}
