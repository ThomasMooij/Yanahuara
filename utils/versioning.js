export async function getVersionedTitle(title, Model) {

    const existingTitles = await Model.find({ title: { $regex: new RegExp(`^${title}(\\.\\d+\\.\\d+)?$`, 'i') } });
    let version = 0;
    let newTitle = title;
  
    if (existingTitles.length > 0) {
      const versions = existingTitles.map((list) => {
        const lastVersion = list.title.match(/(\d+\.\d+)$/);
        return lastVersion ? parseInt(lastVersion[0].split('.')[1], 10) : 0;
      });
      version = Math.max(...versions) + 1;
      newTitle = `${title}.${version}.0`;
    }
  
    return newTitle;

  }