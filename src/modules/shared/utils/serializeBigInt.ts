function serializeBigIntAndDate(obj: any): any {
  if (typeof obj === 'bigint') {
    return obj.toString();
  }

  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeBigIntAndDate);
  }

  if (typeof obj === 'object' && obj !== null) {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = serializeBigIntAndDate(obj[key]);
    }
    return newObj;
  }

  return obj;
}


export default serializeBigIntAndDate;