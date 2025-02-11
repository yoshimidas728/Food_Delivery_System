import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { SettingsModule } from './settings/settings.module';
import { CouponsModule } from './coupons/coupons.module';
import { CategoriesModule } from './categories/categories.module';
import { AttributesModule } from './attributes/attributes.module';
import { AddressesModule } from './addresses/addresses.module';
import { ShopsModule } from './shops/shops.module';
import { TypesModule } from './types/types.module';
import { TagsModule } from './tags/tags.module';
import { FaqsModule } from './faqs/faqs.module';
import { UploadsModule } from './uploads/uploads.module';
import { WithdrawsModule } from './withdraws/withdraws.module';
import { TaxesModule } from './taxes/taxes.module';
import { ShippingsModule } from './shippings/shippings.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { ImportsModule } from './imports/imports.module';
import { WalletsModule } from './wallets/wallets.module';
import { RefundsModule } from './refunds/refunds.module';
import { AuthorsModule } from './authors/authors.module';
import { ManufacturersModule } from './manufacturers/manufacturers.module';
import { QuestionsModule } from './questions/questions.module';
import { FeedbackModule } from './feedback/feedback.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PaymentModule } from './payment/payment.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { StripeModule } from 'nestjs-stripe';
import { PaymentIntentModule } from './payment-intent/payment-intent.module';
import { ConfigModule } from '@nestjs/config';
import { StoreNoticesModule } from './store-notices/store-notices.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AiModule } from './ai/ai.module';
import { RefundPoliciesModule } from './refund-policies/refund-policies.module';
import { RefundReasonModule } from './refund-reason/refund-reason.module';
import { TermsAndConditionModule } from './terms-conditions/terms-conditions.module';
import { NotifyLogsModule } from './notify-log/notify-logs.module';
import { FlashSaleModule } from './flash-sale/flash-sale.module';

// import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    StripeModule.forRoot({
      apiKey: process.env.STRIPE_API_KEY,
      apiVersion: '2022-11-15',
    }),
    UsersModule,
    ProductsModule,
    OrdersModule,
    SettingsModule,
    CouponsModule,
    CategoriesModule,
    AttributesModule,
    AddressesModule,
    ShopsModule,
    TypesModule,
    TagsModule,
    FaqsModule,
    UploadsModule,
    // CommonModule,
    WithdrawsModule,
    TaxesModule,
    ShippingsModule,
    AnalyticsModule,
    ImportsModule,
    WalletsModule,
    RefundsModule,
    AuthorsModule,
    ManufacturersModule,
    FeedbackModule,
    QuestionsModule,
    ReviewsModule,
    PaymentModule,
    PaymentMethodModule,
    PaymentIntentModule,
    StoreNoticesModule,
    MessagesModule,
    ConversationsModule,
    AiModule,
    RefundPoliciesModule,
    RefundReasonModule,
    TermsAndConditionModule,
    NotifyLogsModule,
    FlashSaleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
