# ![Version](https://img.shields.io/badge/version-1.8.0-green.svg)

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

### negative

```
cosnt ownValue = Promise.resolve({
    1: 2
});
const valueService = new ValueService(ownValue, null, null);
const res = await valueService.getCount(1);
// res = 10
```

### custom

```
class CustomValueHandler extends ValueHandlerBase {
    public async handle(value: IValue, valueService: ValueService) {
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
// res = 10
```