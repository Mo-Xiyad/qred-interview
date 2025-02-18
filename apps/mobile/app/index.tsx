import { api } from '@/utils/api';
import { Feather } from '@expo/vector-icons';
import {
  ChevronDownIcon,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger
} from '@gluestack-ui/themed';

import React, { useEffect, useMemo, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [selectedCompany, setSelectedCompany] = useState<number>(1);
  const [selectedCard, setSelectedCard] = useState<number>();

  const companyQuery = api.company.companyList.useQuery(undefined, {
    retry: false,
    enabled: true
  });

  const cards = api.card.getCardsById.useQuery(
    useMemo(
      () => ({
        companyId: selectedCompany,
        userId: 1
      }),
      [selectedCompany]
    ),
    {
      enabled: !!selectedCompany
    }
  );

  const spendingDetails = api.card.getCardSpendingDetails.useQuery(
    { cardId: selectedCard ?? cards.data?.[0].id ?? 1 },
    {
      enabled: !!selectedCard
    }
  );

  const dueInvoicesQuery = api.invoice.getDueInvoices.useQuery(
    { companyId: selectedCompany },
    {
      enabled: !!selectedCompany
    }
  );

  const transactionsQuery = api.card.getCardTransactions.useQuery(
    { cardId: selectedCard ?? 1 },
    {
      enabled: true
    }
  );

  useEffect(() => {
    if (companyQuery.data && companyQuery.data.length > 0 && !selectedCompany) {
      setSelectedCompany((prev) => prev || companyQuery.data[0].id);
      setSelectedCard(cards.data?.[0].id);
    }

    if (cards.data && cards.data.length > 0) {
      setSelectedCard(cards.data[0].id);
    }
  }, [companyQuery.data, selectedCompany, cards.data, selectedCard]);

  if (companyQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (companyQuery.isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error: {companyQuery.error.message}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView>
        <View className="flex-row justify-between items-center px-4 py-3">
          <Image
            source={require('../assets/images/logo.jpg')}
            className="w-24 h-8"
            resizeMode="contain"
          />
          <TouchableOpacity>
            <Feather name="menu" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="px-4 py-3">
          <Select
            selectedValue={selectedCompany?.toString()}
            onValueChange={(value) => setSelectedCompany(Number(value))}
            initialLabel={companyQuery.data?.[0].name}
          >
            <SelectTrigger variant="outline" size="md">
              <SelectInput placeholder="Select option" />
              <SelectIcon className="mr-3" as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                {companyQuery.data?.map((company) => (
                  <SelectItem
                    key={company.id}
                    label={company.name}
                    value={company.id.toString() as string}
                  />
                ))}
              </SelectContent>
            </SelectPortal>
          </Select>
        </View>
        <View className="px-4 mt-2">
          <TouchableOpacity className="bg-gray-100 rounded-xl p-4 mb-[-30] z-10">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm text-gray-500">Invoice Due</Text>
                <Text className="text-lg font-semibold">
                  {dueInvoicesQuery.data?.[0]?.amountDue} kr
                </Text>
              </View>
              <Feather name="chevron-right" size={24} color="#000" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity className="rounded-xl ">
            <View className="flex-row justify-between items-center relative">
              {cards.data?.map((card, index) => (
                <React.Fragment key={card.id}>
                  <TouchableOpacity
                    className={`p-2 absolute left-1 bottom-50 z-10 opacity-30`}
                  >
                    <Feather name="chevron-left" size={34} color="#000" />
                  </TouchableOpacity>
                  <Image
                    source={require(`../assets/images/card1.jpg`)}
                    className="w-full h-72"
                  />

                  <TouchableOpacity
                    disabled={cards.data?.length === 1}
                    className={`p-2 absolute right-1 bottom-50 z-10 opacity-30`}
                  >
                    <Feather
                      name="chevron-right"
                      size={34}
                      strokeWidth={3}
                      color="#ccc"
                    />
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </TouchableOpacity>
          <View>
            <Text className="text-sm text-gray-500">spend limit:</Text>
            <Text>{cards.data?.[0]?.spendLimit}</Text>
          </View>
        </View>

        <TouchableOpacity className="px-4 mt-4">
          <View className="bg-gray-100 rounded-xl p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-gray-500">Remaining Spend</Text>
              <Feather name="chevron-right" size={24} color="#000" />
            </View>
            <View className="bg-gray-200 h-2 rounded-full">
              <View className="bg-blue-500 h-2 rounded-full w-1/2" />
            </View>
            <Text className="mt-2 font-semibold">
              {spendingDetails.data?.remainingSpend}/
              {spendingDetails.data?.spendLimit} kr
            </Text>
          </View>
        </TouchableOpacity>

        <View className="px-4 mt-4">
          <Text className="text-lg font-semibold mb-3">
            Latest Transactions
          </Text>

          <View className="gap-3">
            {transactionsQuery.data?.transactions.slice(0, 3).map((item) => (
              <TouchableOpacity
                key={item.id}
                className="bg-gray-100 rounded-xl p-4"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="font-medium">
                      {item.description} {item.amount} kr
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="font-semibold">{item.amount} kr</Text>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity className="py-2">
              <Text className="text-blue-500 text-center">
                {transactionsQuery.data?.transactions.length &&
                  transactionsQuery.data?.transactions.length - 3}{' '}
                more items in transaction view
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-4 mt-4 mb-6 gap-3">
          <TouchableOpacity className="bg-blue-500 rounded-xl p-4">
            <Text className="text-white text-center font-semibold">
              Activate Card
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-100 rounded-xl p-4">
            <Text className="text-center font-semibold">
              Contact Qred's Support
            </Text>
          </TouchableOpacity>
        </View>

        {/* <View className="flex-row justify-between items-center px-4 py-2"></View> */}
      </ScrollView>
    </SafeAreaView>
  );
}
