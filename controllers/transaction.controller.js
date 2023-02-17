const { Transactions } = require('../models/index')


async function getItemTransactions (req, res) {
  const { id } = req.params

  try {
    const items = await Transactions.findAll({
      order: [
        ['updatedAt', 'DESC']
      ],
      where: {
        ItemId: id
      }
    })

    return res.status(200).json({
      data: {
        message: 'Success get products',
        items,
      },
    })
  } catch (error) {
    return res.status(500).json({
      messages: ['Internal server error']
    })
  }
}

module.exports = { getItemTransactions }