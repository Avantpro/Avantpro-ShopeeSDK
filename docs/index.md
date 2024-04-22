# Exemplo de uso

### Gerar Link Para Authorization

```ts
import { ShopeeSDK } from 'shopee-sdk'


let MyApp = new ShopeeSDK({
  partnerId:'123123',
  partnerKey:'456456',
  sandbox:true
})

MyApp.auth.getAuthorizationLink('http://localhost:9001')
```

### Gerar Refresh Token

```ts
import { ShopeeSDK } from 'shopee-sdk'


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
