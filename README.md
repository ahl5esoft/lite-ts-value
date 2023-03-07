# ![Version](https://img.shields.io/badge/version-1.11.0-green.svg)

## install

```
npm install lite-ts-value
```

## use

```
import { ValueService } from 'lite-ts-value';
import moment from 'moment';

const getCountHandler: ValueHandlerBase;
const updateHandler: ValueHandlerBase;
cosnt ownValue = Promise.resolve({
    valueType: count,
    ...
});
const nowPromise = Promise.resolve(
    momnet().unix(),
);
const valueService = new ValueService(ownValue, getCountHandler, updateHandler, nowPromise);
```

## ValueService

### condition

```
const res = await valueService.checkConditions([
    [{
        count: 11,
        op: RelationOperator.eq,
        valueType: 1
    }, {
        count: 20,
        op: RelationOperator.gt,
        valueType: 2
    }, {
        count: 35,
        op: RelationOperator.lt,
        valueType: 3
    }],
    [{
        count: 9,
        op: RelationOperator.eq,
        valueType: 1
    }, {
        count: 20,
        op: RelationOperator.gt,
        valueType: 2
    }, {
        count: 35,
        op: RelationOperator.lt,
        valueType: 3
    }]
]);
// res = (ownValue[1] == 11 && ownValue[2] > 20 && ownValue[3] < 35) || (ownValue[1] == 9 && ownValue[2] > 20 && ownValue[3] < 35)
```

### check enought

```
const res = await valueService.checkEnough([{
    count: -1,
    valueType: 2
}, {
    count: -5,
    valueType: 3
}]);
// res = ownValue[2] >= 1 && ownValue[3] >= 5
```

### get count

```
const res = await valueService.getCount(1);
// res = ownValue[1]
```

### update

```
await valueService.update([{
    count: 1,
    valueType: 2
}, {
    count: 3,
    valueType: 4
}]);
// ownValue[2] += 1
// ownValue[4] += 3
```

## ValueHandlerBase

### isReplace

```
cosnt ownValue = Promise.resolve({
    1: 2
});
const valueService = new ValueService(ownValue, null, null, null);
await valueService.update([{
    count: 11,
    valueType: 1
}]);
// ownValue = { 1: -1 }
```

### negative

```
cosnt ownValue = Promise.resolve({
    1: 2
});
const valueService = new ValueService(ownValue, null, null, null);
await valueService.update([{
    count: -3,
    valueType: 1
}]);
// ownValue = { 1: -1 }
```

### range.max

```
// range.max = 10
cosnt ownValue = Promise.resolve({
    1: 2,
});
const valueService = new ValueService(ownValue, null, null, null);
await valueService.update([{
    count: 20,
    valueType: 1
}]);
// ownValue = { 1: 10 }
```

### range.min

```
// range.min = 0
cosnt ownValue = Promise.resolve({
    1: 2,
});
const valueService = new ValueService(ownValue, null, null, null);
await valueService.update([{
    count: -100,
    valueType: 1
}]);
// ownValue = { 1: 0 }
```

### sync

```
// sync.valueTypes = [11, 111]
cosnt ownValue = Promise.resolve({
    1: 2,
});
const valueService = new ValueService(ownValue, null, null, null);
await valueService.update([{
    count: 5,
    valueType: 1
}]);
// ownValue = { 1: 7, 11: 5, 111: 5 }
```

### time

```
// different day
cosnt ownValue = Promise.resolve({
    1: 2,
});
const valueService = new ValueService(ownValue, null, null, null);
await valueService.update([{
    count: 3,
    valueType: 1
}]);
// ownValue = { 1: 3 }
```

### custom

```
class CustomValueHandler extends ValueHandlerBase {
    public async handle(value: Value, valueService: ValueService) {
        value.count += 10;
        this.next?.handle?.(value, valueService);
    }   
}

const getCountHandler = new CustomValueHandler();
cosnt ownValue = Promise.resolve({
    1: 10
});
const nowUnix = momnet().unix();
const valueService = new ValueService(ownValue, getCountHandler, null, nowUnix);
const res = await valueService.getCount(1);
// res = 20
```
### autoRecovery
```
cosnt ownValue = Promise.resolve({
    1: 15,
    2: 30,
    3: 1678093998
});
// nowUnix = 1678101198;
const nowUnix = momnet().unix();
const valueService = new ValueService(ownValue, getCountHandler, updateHandler, nowUnix);
const res = await valueService.getCount(1);
// res = 24
```