// Chỉ chứa dữ liệu thô (Raw Data)

export const MOCK_DEADLINES = [
    { id: 1, deviceName: 'Camon EOS R5', daysLeft: 'Còn lại 2 ngày' },
    { id: 2, deviceName: 'Sony Lens 50mm', daysLeft: 'Còn lại 3 ngày' },
    // { id: 3, deviceName: 'Mic Rode', daysLeft: 'Còn lại 5 ngày' }, 
];

export const MOCK_DEVICES = [
    { id: 'D001', name: 'Camon EOS R5', description: 'Thiết bị điện thông minh...', quantity: 7, imageUrl: 'https://via.placeholder.com/150x150?text=Camera' },
    { id: 'D002', name: 'Microphone Rode', description: 'Microphone phòng thu...', quantity: 3, imageUrl: 'https://via.placeholder.com/150x150?text=Mic' },
    { id: 'D003', name: 'Gimbal DJI', description: 'Chống rung...', quantity: 5, imageUrl: 'https://via.placeholder.com/150x150?text=Gimbal' },
];

export const MOCK_CATEGORIES = [
    { title: 'Camera Recorder', data: MOCK_DEVICES },
    { title: 'Microphone', data: MOCK_DEVICES }, 
    { title: 'Camera', data: MOCK_DEVICES },
];