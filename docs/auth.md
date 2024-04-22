# Auth

### Gerar Link Para Authorization

```ts
import { ShopeeSDK } from '@avantpro/shopee-sdk'


let MyApp = new ShopeeSDK({
  partnerId:'123123',
  partnerKey:'456456',
  sandbox:true
})

MyApp.auth.getAuthorizationLink('http://localhost:9001')

// Retorno
//https://partner.test-stable.shopeemobile.com/api/v2/shop/auth_partner?partner_id=123123&timestamp=1713793173&sign=2507bf24bc5ae7969a5ed6e2d4d7861e76c0bcd1f4c4d73263a48912f1fe0cbc&redirect=http%3A%2F%2Flocalhost%3A9001
```

### Gerar RefreshToken

```ts
import { ShopeeSDK } from '@avantpro/shopee-sdk'


let MyApp = new ShopeeSDK({
  partnerId:'123123',
  partnerKey:'456456',
  sandbox:true
})

console.log(await MyApp.auth.getRefreshToken({code:'72716256464a6550796f424361624277',shop_id:789789}));

// Retorno 
// {
//   access_token: '4c6f7744256464a655064d484d6452a67',
//   refresh_token: '4b5847442632436162426f48426b6470',
//   expire_in: 14400
// }
```

### Gerar AcessToken

```ts
import { ShopeeSDK } from '@avantpro/shopee-sdk'


let MyApp = new ShopeeSDK({
  partnerId:'123123',
  partnerKey:'456456',
  sandbox:true
})

console.log(await MyApp.auth.getAccessToken({refresh_token:'4b5847442632436162426f48426b6470',shop_id:789789}));

// Retorno 
// {
//   access_token: '4c6f7744256464a655064d484d6452a67',
//   refresh_token: '4b5847442632436162426f48426b6470',
//   expire_in: 14400
// }
```
