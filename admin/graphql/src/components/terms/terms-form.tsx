import Input from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button';
import TextArea from '@/components/ui/text-area';
import Description from '@/components/ui/description';
import Card from '@/components/common/card';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { getErrorMessage } from '@/utils/form-error';
import { Config } from '@/config';
import { useCallback, useEffect, useMemo } from 'react';
import { useModalAction } from '@/components/ui/modal/modal.context';
import OpenAIButton from '@/components/openAI/openAI.button';
import { chatbotAutoSuggestionForFAQs } from '@/components/faqs/faqs-ai-prompts';
import { useSettingsQuery } from '@/graphql/settings.graphql';
import { ItemProps } from '@/types/custom-types';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';
import { Routes } from '@/config/routes';
import { toast } from 'react-toastify';
import { termsValidationSchema } from '@/components/terms/terms-validation-schema';
import { TermsAndConditions } from '__generated__/__types__';
import {
  useCreateTermsConditionsMutation,
  useUpdateTermsConditionsMutation,
} from '@/graphql/terms.graphql';
import { useShopLazyQuery } from '@/graphql/shops.graphql';

type FormValues = {
  title: string;
  description: string;
  slug: string;
};

type IProps = {
  initialValues?: TermsAndConditions | null;
};
export default function CreateOrUpdateTermsForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    locale,
    query: { shop },
  } = router;
  const { data: options } = useSettingsQuery({
    variables: {
      language: locale,
    },
  });

  const generateRedirectUrl = router.query.shop
    ? `/${router.query.shop}${Routes.termsAndCondition.list}`
    : Routes.termsAndCondition.list;

  const { openModal } = useModalAction();

  const [getShop, { data: shopData }] = useShopLazyQuery();

  useEffect(() => {
    if (shop) {
      getShop({
        variables: {
          slug: shop as string,
        },
      });
    }
  }, [shop]);

  const shopId = shopData?.shop?.id!;

  const {
    register,
    handleSubmit,
    control,
    watch,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    // @ts-ignore
    defaultValues: initialValues,
    //@ts-ignore
    resolver: yupResolver(termsValidationSchema),
  });

  const [createTermsMutation, { loading: creating }] =
    useCreateTermsConditionsMutation({
      onCompleted: async () => {
        if (shop) {
          await router.push(
            `/${shop}${Routes.termsAndCondition.list}`,
            undefined,
            {
              locale: Config.defaultLanguage,
            },
          );
        } else {
          await router.push(Routes.termsAndCondition.list, undefined, {
            locale: Config.defaultLanguage,
          });
        }
        toast.success(t('common:successfully-created'));
      },
    });
  const [updateTermsMutation, { loading: updating }] =
    useUpdateTermsConditionsMutation({
      onCompleted: async ({ updateTermsConditions }) => {
        if (updateTermsConditions) {
          if (initialValues?.slug !== updateTermsConditions?.slug) {
            await router.push(
              `${generateRedirectUrl}/${updateTermsConditions?.slug}/edit`,
              undefined,
              {
                locale: Config.defaultLanguage,
              },
            );
          }
        }

        toast.success(t('common:successfully-updated'));
      },
      // onError: (error) => {
      //   const serverErrors = getErrorMessage(error);
      //   if (serverErrors?.validation.length) {
      //     Object.keys(serverErrors?.validation).forEach((field: any) => {
      //       setError(field.split('.')[1], {
      //         type: 'manual',
      //         message: serverErrors?.validation[field][0],
      //       });
      //     });
      //   } else {
      //     setErrorMessage(error?.message);
      //   }
      // },
    });

  const termsName = watch('title');
  // const slugAutoSuggest = formatSlug(termsName);
  const autoSuggestionList = useMemo(() => {
    return chatbotAutoSuggestionForFAQs({ name: termsName ?? '' });
  }, [termsName]);

  const handleGenerateDescription = useCallback(() => {
    openModal('GENERATE_DESCRIPTION', {
      control,
      name: termsName,
      set_value: setValue,
      key: 'description',
      suggestion: autoSuggestionList as ItemProps[],
    });
  }, [termsName]);

  const onSubmit = async (values: FormValues) => {
    const inputValues = {
      language: router.locale,
      title: values.title,
      description: values.description,
    };
    try {
      if (
        !initialValues ||
        !initialValues?.translated_languages?.includes(router?.locale!)
      ) {
        await createTermsMutation({
          variables: {
            input: {
              ...inputValues,
              ...(initialValues?.slug && { slug: initialValues.slug }),
              shop_id: shopId || initialValues?.shop_id,
              // language: router.locale,
              ...(initialValues?.slug && { slug: initialValues.slug }),
            },
          },
        });
      } else {
        await updateTermsMutation({
          variables: {
            input: {
              ...inputValues,
              id: initialValues.id!,
              shop_id: initialValues.shop_id!,
            },
          },
        });
      }
    } catch (error) {
      const serverErrors = getErrorMessage(error);
      Object.keys(serverErrors?.validation).forEach((field: any) => {
        setError(field.split('.')[1], {
          type: 'manual',
          message: serverErrors?.validation[field][0],
        });
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="my-5 flex flex-wrap sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:terms-conditions-form-info-help-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5"
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={`${t('form:input-title')}*`}
            {...register('title')}
            error={t(errors.title?.message!)}
            variant="outline"
            className="mb-5"
            // disabled={isTranslateFaqs}
          />

          <div className="relative">
            {/* {options?.useAi && (
              <div
                onClick={handleGenerateDescription}
                className="absolute right-0 z-10 text-sm font-medium cursor-pointer -top-1 text-accent hover:text-accent-hover"
              >
                Generate
              </div>
            )} */}

            {options?.settings?.options?.useAi && (
              <OpenAIButton
                title={t('form:button-label-description-ai')}
                onClick={handleGenerateDescription}
              />
            )}

            <TextArea
              label={`${t('form:input-label-description')}*`}
              {...register('description')}
              error={t(errors.description?.message!)}
              variant="outline"
              className="mb-5"
              // disabled={isTranslateFaqs}
            />
          </div>
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-terms-conditions')
              : t('form:button-label-add-terms-conditions')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
