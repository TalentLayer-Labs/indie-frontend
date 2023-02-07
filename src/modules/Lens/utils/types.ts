export type IlensUser = {
  id: string;
  name: string;
  bio: string;
  handle: string;
  picture: ILensMedia;
  stats: {
    totalCollects: number;
    totalComments: number;
    totalFollowers: number;
    totalFollowing: number;
    totalMirrors: number;
    totalPosts: number;
    totalPublications: number;
  };
};

export type IlensFeed = ILensPublication[];

export type ILensPublication = {
  id: any;
  metadata: {
    name: string;
    description: string;
    content: string;
    media: ILensMedia[];
    attributes: {
      displayType: string;
      traitType: string;
      value: string;
    }[];
  };
  createdAt: string;
  stats: {
    totalAmountOfMirrors: number;
    totalAmountOfCollects: number;
    totalAmountOfComments: number;
    totalUpvotes: number;
    totalDownvotes: number;
  };
};

export type ILensMedia = {
  original: {
    url: string;
    mimeType: string;
  };
};
