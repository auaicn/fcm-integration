export const mockup_helper = {
  sampleIamgeUrl: {
    jpg: 'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Speaker.jpg',
    png: 'https://vetching-public-storage-dev.s3.ap-northeast-2.amazonaws.com/test/Object_Camera.png',
    pic_sum:
      'https://fastly.picsum.photos/id/1075/200/300.jpg?hmac=pffU5_mFDClpUhsTVng81yHXXvdsGGKHi1jCz2pRsaU',
  },
  getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  },
  generateRandomString: (length: number): string => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
};
