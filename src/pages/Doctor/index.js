import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import {DoctorCategory, Gap, HomeProfile, NewItems} from '../../components';
import RatedDoctor from '../../components/molekul/RatedDoctor';
import {colors, fonts, showError} from '../../utils';
import {get, limitToLast, orderByChild, query, ref} from 'firebase/database';
import {db} from '../../config';

const Doctor = ({navigation}) => {
  const [news, setNews] = useState([]);
  const [categoryDoctor, setCategoryDoctor] = useState([]);
  const [ratedDoctor, setRatedDoctor] = useState([]);
  useEffect(() => {
    getNews();
    getCategoryDoctor();
    getRatedDoctor();
  }, []);

  const getNews = async () => {
    try {
      const newsRef = ref(db, 'news');
      const newsSnapshot = await get(newsRef);
      const data = newsSnapshot.val();
      const filterData = data.filter(el => el !== null);
      setNews(filterData);
    } catch (error) {
      showError(error.message);
    }
  };
  const getCategoryDoctor = async () => {
    try {
      const categoryDoctorRef = ref(db, 'categorydoctor');
      const snapshot = await get(categoryDoctorRef);
      const data = snapshot.val();
      const filterData = data.filter(el => el !== null);
      setCategoryDoctor(filterData);
    } catch (error) {
      showError(error.message);
    }
  };

  const getRatedDoctor = async () => {
    try {
      const ratedDoctorRef = ref(db, 'doctors');
      const queryDoctor = query(
        ratedDoctorRef,
        orderByChild('rate'),
        limitToLast(3),
      );
      const ratedSnapshot = await get(queryDoctor);
      const ratedDoctors = [];

      if (ratedSnapshot.exists()) {
        ratedSnapshot.forEach(childSnapshot => {
          const doctorData = childSnapshot.val();
          ratedDoctors.push(doctorData);
        });
      }
      setRatedDoctor(ratedDoctors);
    } catch (error) {
      showError(error.message);
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.wrapperSection}>
            <Gap height={30} />
            <HomeProfile onPress={() => navigation.navigate('UserProfile')} />
            <Text style={styles.welcome}>
              Mau konsultasi dengan siapa hari ini ?
            </Text>
          </View>
          <View style={styles.wrapperScroll}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.category}>
                <Gap width={32} />
                {categoryDoctor.map(item => (
                  <DoctorCategory
                    category={item.category}
                    key={item.id}
                    onPress={() => navigation.navigate('ChooseDoctor', item)}
                  />
                ))}

                <Gap width={22} />
              </View>
            </ScrollView>
          </View>
          <View style={styles.wrapperSection}>
            <Text style={styles.sectionLabel}>Top Rated Doctor</Text>
            {ratedDoctor.map(item => (
              <RatedDoctor
                name={item.fullName}
                desc={item.profession}
                avatar={{uri: item.photo}}
                onPress={() => navigation.navigate('DoctorProfile', item)}
                key={item.uid}
              />
            ))}
            <Text style={styles.sectionLabel}>Good News</Text>
          </View>

          {news.map(item => (
            <NewItems
              title={item.title}
              date={item.date}
              image={item.image}
              key={item.id}
            />
          ))}
          <Gap height={30} />
        </ScrollView>
      </View>
    </View>
  );
};

export default Doctor;

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.secondary,
    flex: 1,
  },
  content: {
    backgroundColor: colors.white,
    flex: 1,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  wrapperSection: {
    paddingHorizontal: 16,
  },
  welcome: {
    fontSize: 30,
    fontFamily: fonts.primary[600],
    marginTop: 30,
    marginBottom: 16,
    maxWidth: 320,
  },
  category: {
    flexDirection: 'row',
  },
  wrapperScroll: {
    marginHorizontal: -16,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: fonts.primary[600],
    color: colors.text.primary,
    marginTop: 30,
    marginBottom: 16,
  },
});
